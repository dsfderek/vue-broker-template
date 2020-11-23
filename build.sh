/usr/local/node-v10.14.0-linux-x64/bin/npm config set user 0 
/usr/local/node-v10.14.0-linux-x64/bin/npm config set unsafe-perm true 
/usr/local/node-v10.14.0-linux-x64/bin/npm config set registry http://registry.npmjs.org
/usr/local/node-v10.14.0-linux-x64/bin/npm -q --cache-min Infinity install
echo "===========start to build==========="
/usr/local/node-v10.14.0-linux-x64/bin/npm run build
echo "===========build finished==========="