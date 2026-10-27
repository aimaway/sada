"""
WebSocket Connection Manager pour le temps réel
"""
from fastapi import WebSocket
from typing import List, Dict
import json


class ConnectionManager:
    """Gestionnaire de connexions WebSocket"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accepter une nouvelle connexion WebSocket"""
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Déconnecter un WebSocket"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from user connections
        for user_id, connections in self.user_connections.items():
            if websocket in connections:
                connections.remove(websocket)
                break
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Envoyer un message à un WebSocket spécifique"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"Error sending message: {e}")
    
    async def broadcast(self, message: dict):
        """Envoyer un message à toutes les connexions actives"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting message: {e}")
    
    async def send_to_user(self, user_id: int, message: dict):
        """Envoyer un message à un utilisateur spécifique"""
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending to user {user_id}: {e}")
    
    def register_user_connection(self, user_id: int, websocket: WebSocket):
        """Enregistrer une connexion pour un utilisateur"""
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)
    
    def unregister_user_connection(self, user_id: int, websocket: WebSocket):
        """Désenregistrer une connexion pour un utilisateur"""
        if user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)


# Singleton instance
manager = ConnectionManager()
