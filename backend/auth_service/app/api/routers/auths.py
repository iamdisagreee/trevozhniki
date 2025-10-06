from fastapi import APIRouter, UploadFile, File, Depends, status, Response, Cookie, Request, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from ...core.dependecies import get_current_user, get_auth_service
from ...schemas.auth import CreateUser, GetUser as UserSchema, GetUser, ConfirmCode, SendConfirmationCode, \
    ValidateAuthForm
from ...services.auths import AuthService

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post("/validate-auth-form")
async def create_validate_form(
        validate_auth: ValidateAuthForm,
        auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.validate_auth_form(validate_auth=validate_auth)

@router.post("/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def create_add_user(
        create_user: CreateUser,
        auth_service: AuthService = Depends(get_auth_service)
):
    """ Создаем пользователя и помещаем в postgres """
    return await auth_service.add_user(create_user=create_user)


# @router.post("/token")
@router.post("/login", response_class=JSONResponse)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        auth_service: AuthService = Depends(get_auth_service)
):
    """ Вход в систему - Получаем access token, а refresh token кладем в о HttpOnly Cookies"""

    return await auth_service.login_user(
        username=form_data.username,
        password=form_data.password,
    )


@router.post("/refresh", response_class=JSONResponse)
async def refresh_access_token(
        refresh_token: str = Cookie(None),
        auth_service: AuthService = Depends(get_auth_service),
):
    """ Получаем новый access token"""
    return await auth_service.refresh_access_token(
        refresh_token=refresh_token,
    )


@router.post("/logout", response_class=JSONResponse)
async def logout(
        request: Request,
        auth_service: AuthService = Depends(get_auth_service),
        current_user: GetUser = Depends(get_current_user),
):
    """ Выход из системы - Удаляем refresh token из куки"""
    return await auth_service.logout_user(request=request)


@router.post("/send-confirmation-code", response_class=JSONResponse)
async def send_confirmation_code(
        send_confirmation: SendConfirmationCode,
        auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.create_send_email(to_email=send_confirmation.email)


@router.post("/confirm-code")
async def confirm_code(
        confirm_code: ConfirmCode,
        auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.confirm_code(
        entered_code=confirm_code.entered_code,
        to_email=confirm_code.email
    )


@router.get('/me', response_class=JSONResponse)
async def me(
        current_user: GetUser = Depends(get_current_user)
):
    return current_user.model_dump()


# @router.get('/cookie', response_class=JSONResponse)
# async def me(request: Request):
#     return {'refreshToken': request.cookies}