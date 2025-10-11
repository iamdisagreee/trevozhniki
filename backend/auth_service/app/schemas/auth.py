from pydantic import BaseModel, ConfigDict, alias_generators, Field, EmailStr, SecretStr

class CamelCaseModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=alias_generators.to_camel,
        from_attributes=True
    )

class ValidateAuthForm(CamelCaseModel):
    email: EmailStr

class CreateUser(CamelCaseModel):
    # firstname: str
    # username: str
    email: EmailStr
    password: str

class GetUser(CamelCaseModel):
    id: int
    # firstname: str
    username: str
    email: EmailStr

class SendConfirmationCode(CamelCaseModel):
    email: EmailStr

class ConfirmCode(CamelCaseModel):
    email: EmailStr
    entered_code: int = Field(ge=100_000, le=999_999)