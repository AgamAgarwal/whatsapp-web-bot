import binascii
import sys

with open(sys.argv[1], 'rb') as f:
    b = f.read()
    h = str(binascii.hexlify(b))[2:-1]
    print(f'const FILE_CONTENT=\'{h}\';')
