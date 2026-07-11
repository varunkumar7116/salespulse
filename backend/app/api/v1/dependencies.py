from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.exceptions import AuthException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise AuthException()
        return {"id": user_id, "role": "admin"}
    except JWTError:
        raise AuthException()
