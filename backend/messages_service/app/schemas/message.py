from pydantic import BaseModel, ConfigDict, alias_generators, Field

class CamelCaseModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=alias_generators.to_camel,
        from_attributes=True
    )
class File(CamelCaseModel):
    name: str = Field(pattern='[a-z]+-'
                              'json-'
                              '20[2-9][0-9].(0[1-9]|1[0-2]).([1-9]|1[0-9]|2[0-9]|3[0-1])-'
                              '([0-1][0-9]|2[1-3]):[0-5][0-9]')

class DeleteFile(File):
    id: int = Field(gt=0)


class ProcessingFile(File):
    pass