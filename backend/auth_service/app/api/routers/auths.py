from fastapi import APIRouter, UploadFile, File, Depends, status, Response, Cookie, Request, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from ...core.dependecies import get_current_user, get_auth_service
from ...schemas.auth import CreateUser, GetUser as UserSchema, GetUser
from ...services.auths import AuthService

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post("/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def create_add_user(
        create_user: CreateUser,
        auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.add_user(create_user=create_user)


# @router.post("/token")
@router.post("/login")
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.login_user(
        username=form_data.username,
        password=form_data.password,
    )


@router.post("/refresh")
async def refresh_access_token(
        refresh_token: str = Cookie(None),
        auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.refresh_access_token(
        refresh_token=refresh_token,
    )


@router.post("/logout")
async def logout(
        request: Request,
        auth_service: AuthService = Depends(get_auth_service),
        current_user: GetUser = Depends(get_current_user),
):
    print(request.cookies)
    return await auth_service.logout_user()


@router.get('/me')
async def me(
        current_user: GetUser = Depends(get_current_user)
):
    return current_user.model_dump()
