mkdir -p ~/.selectels3 wget https://secure.globalsign.net/cacert/root-r6.crt -O
~/.selectels3/root.crt openssl x509 -inform der -in ~/.selectels3/root.crt -out
~/.selectels3/root.crt chmod 600 ~/.selectels3/root.crt
