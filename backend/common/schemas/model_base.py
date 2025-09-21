from pydantic import BaseModel, ConfigDict, alias_generators


# Корневая модель для корректной обработки json
class CamelCaseModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=alias_generators.to_camel,
        from_attributes=True
    )