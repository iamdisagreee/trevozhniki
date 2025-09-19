from fileinput import filename
from io import StringIO
from fastapi import UploadFile

text = 'Aye brother'

text_io = StringIO(text)

upload = UploadFile(filename='aue.txt', file=text)

print(upload.file)

