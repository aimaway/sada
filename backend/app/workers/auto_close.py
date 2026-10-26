"""
Background worker pour l'auto-close des jobs après 24h
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Job, JobStatus, ProviderProfile
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def check_auto_close_jobs():
    """
    Vérifier les jobs qui doivent être auto-clôturés après 24h
    Cette fonction doit être appelée périodiquement (toutes les 5 minutes)
    """
    db: Session = SessionLocal()
    
    try:
        # Trouver les jobs en cours dont le deadline est dépassé
        now = datetime.utcnow()
        
        jobs_to_close = db.query(Job).filter(
            Job.status == JobStatus.IN_PROGRESS,
            Job.auto_close_deadline <= now,
            Job.auto_closed == False,
            Job.dispute_open == False
        ).all()
        
        for job in jobs_to_close:
            # Vérifier qu'il n'y a pas de quote update en attente
            if job.quote_update and not job.quote_update_approved:
                logger.info(f"Job {job.id} has pending quote update, skipping auto-close")
                continue
            
            # Auto-close le job
            job.status = JobStatus.AUTO_CLOSED
            job.auto_closed = True
            job.completed_at = now
            
            # Calculer la commission
            commission = int(job.agreed_price * 0.10)
            
            # Débiter le wallet du provider
            provider = db.query(ProviderProfile).filter(
                ProviderProfile.id == job.provider_id
            ).first()
            
            if provider:
                provider.wallet_balance -= commission
                
                # Vérifier si le wallet est suffisant
                if provider.wallet_balance < provider.min_wallet_balance:
                    provider.is_online = False
                    logger.warning(
                        f"Provider {provider.id} wallet below minimum, set offline"
                    )
            
            logger.info(
                f"Job {job.id} auto-closed after 24h. "
                f"Commission {commission} charged to provider {provider.id if provider else 'N/A'}"
            )
            
            # TODO: Envoyer notification au client et au provider
            # await send_notification(job.customer_id, "job_auto_closed", {...})
            # await send_notification(provider.user_id, "job_auto_closed", {...})
        
        db.commit()
        logger.info(f"Auto-close check completed. {len(jobs_to_close)} jobs closed.")
        
    except Exception as e:
        logger.error(f"Error in auto-close worker: {e}")
        db.rollback()
    finally:
        db.close()


def send_reminders():
    """
    Envoyer des rappels aux providers pour les jobs qui approchent du deadline
    Rappels à 12h, 20h et 23h
    """
    db: Session = SessionLocal()
    
    try:
        now = datetime.utcnow()
        
        # Rappels à 12h (12 heures avant deadline)
        jobs_12h = db.query(Job).filter(
            Job.status == JobStatus.IN_PROGRESS,
            Job.auto_close_deadline <= now + timedelta(hours=12),
            Job.auto_close_deadline > now + timedelta(hours=11),
            Job.auto_closed == False
        ).all()
        
        for job in jobs_12h:
            logger.info(f"Sending 12h reminder for job {job.id}")
            # TODO: Send notification
            # await send_notification(job.provider.user_id, "job_reminder_12h", {...})
        
        # Rappels à 20h (4 heures avant deadline)
        jobs_20h = db.query(Job).filter(
            Job.status == JobStatus.IN_PROGRESS,
            Job.auto_close_deadline <= now + timedelta(hours=4),
            Job.auto_close_deadline > now + timedelta(hours=3),
            Job.auto_closed == False
        ).all()
        
        for job in jobs_20h:
            logger.info(f"Sending 4h reminder for job {job.id}")
            # TODO: Send notification
        
        # Rappels à 23h (1 heure avant deadline)
        jobs_23h = db.query(Job).filter(
            Job.status == JobStatus.IN_PROGRESS,
            Job.auto_close_deadline <= now + timedelta(hours=1),
            Job.auto_close_deadline > now,
            Job.auto_closed == False
        ).all()
        
        for job in jobs_23h:
            logger.warning(f"Sending 1h URGENT reminder for job {job.id}")
            # TODO: Send urgent notification
        
        db.commit()
        
    except Exception as e:
        logger.error(f"Error in reminder worker: {e}")
        db.rollback()
    finally:
        db.close()


def run_worker():
    """
    Boucle principale du worker
    """
    import time
    
    logger.info("Starting auto-close worker...")
    
    while True:
        try:
            # Check auto-close
            check_auto_close_jobs()
            
            # Send reminders
            send_reminders()
            
            # Sleep for configured interval
            time.sleep(settings.AUTO_CLOSE_CHECK_INTERVAL_MINUTES * 60)
            
        except KeyboardInterrupt:
            logger.info("Worker stopped by user")
            break
        except Exception as e:
            logger.error(f"Worker error: {e}")
            time.sleep(60)  # Wait 1 minute before retrying


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_worker()
