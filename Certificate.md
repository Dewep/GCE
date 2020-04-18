# New load-balancer with SSL certificate

GCE allows you to use your personal domain names, in local, instead of using tons of 127.0.0.1 with random ports: gce.hello-world.com project-a.hello-world.com project-b.hello-world.com ...

More than this, you can also configure a SSL certificate, to use HTTPS in local. Useless you think? Not at all! Less developement conditions, less difference with the production builds, access to restrict browser functions (location, mediastream, etc.).

## Buy a domain name

Some TLDs are 1-2€ per year, don't be stingy.

Example: https://www.ovh.com/fr/order/domain/

## Reset the DNS Zone

To use the domain in local, add 2 `A` entries:

```
   IN A  127.0.0.1
*  IN A  127.0.0.1
```

## Generate SSL certificates

Install certbot (or use a one installed on your server), and *renew* a wildcard certificate for that domain:

`certbot certonly --manual --preferred-challenges dns -m github@dewep.net -d hello-world.com -d *.hello-world.com`

Follow the instruction, by adding the `TXT` entries (you can delete them just after).

Don't forget to renew the domain every 2-3 months.

## GCE configuration

Export the generated certificates into your GCE configuration:

- `/etc/letsencrypt/live/hello-world.com/fullchain.pem` => `./config/my-personal-projects/hello-world.com.crt`
- `/etc/letsencrypt/live/hello-world.com/privkey.pem` => `./config/my-personal-projects/hello-world.com.key`

Then set your GCE load-balancers configurations (`./config/my-personal-projects/index.js`):

```js
loadBalancers: {
  '.hello-world.com': {
    crt: fs.readFileSync(path.resolve(__dirname, 'hello-world.com.crt'), 'utf8'),
    key: fs.readFileSync(path.resolve(__dirname, 'hello-world.com.key'), 'utf8')
  }
},
```

After that, configure all your GCE project to set a loadBalancer option:
```js
loadBalancer: {
  front: {
    hosts: ['abcd.hello-world.com'],
    ports: [4629]
  }
},
```

## Full GCE configuration example

```js
// ./config/config.js

module.exports = [
  // require('./my-company-projects'),
  require('./my-personal-projects')
]
```

```js
// ./config/my-personal-projects/index.js

const fs = require('fs')
const path = require('path')

module.exports = {
  loadBalancers: {
    '.hello-world.com': {
      crt: fs.readFileSync(path.resolve(__dirname, 'hello-world.com.crt'), 'utf8'),
      key: fs.readFileSync(path.resolve(__dirname, 'hello-world.com.key'), 'utf8')
    }
  },
  projects: {
    'My-Projects': {
      path: '../../Projects/abcd',
      directories: {
        'abcd': { // webpack-dev-server --public abcd.hello-world.com
          start: ['npm', 'run', 'dev'],
          loadBalancer: {
            front: {
              hosts: ['abcd.hello-world.com'],
              ports: [4629]
            }
          },
          commands: {
            'npm install': {
              args: ['npm', 'install']
            }
          }
        },
        'abcd-server': {
          path: 'abcd',
          start: ['npm', 'run', 'server-dev'],
          loadBalancer: {
            api: {
              hosts: ['abcd.hello-world.com'],
              path: '/api/',
              ports: [4630]
            },
            ws: {
              hosts: ['abcd.hello-world.com'],
              path: '/ws',
              ports: [4630]
            }
          },
          commands: {
            'npm install': {
              args: ['npm', 'install']
            }
          }
        }
      }
    }
  }
}
```
