module.exports = {
  projects: [
    {
      slug: 'p1',
      name: 'General',
      directories: ['d1']
    },
    {
      slug: 'p2',
      name: 'PandaLab Main',
      directories: ['d2', 'd3', 'd4', 'd5', 'd6', 'd7']
    }
  ],

  groups: [
    {
      slug: 'g1',
      name: 'Windows',
      commands: ['c1', 'c2']
    },
    {
      slug: 'g2',
      name: 'GIT',
      commands: ['c3', 'c4']
    },
    {
      slug: 'g3',
      name: 'npm',
      commands: ['c5']
    }
  ],

  directories: [
    {
      slug: 'd1',
      name: 'Vagrant',
      path: 'C:\\Users\\Dewep\\WorkSpace',
      git: false,
      groups: ['g1'],
      commands: ['c6', 'c7']
    },
    {
      slug: 'd2',
      name: 'App',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\app',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c8']
    },
    {
      slug: 'd3',
      name: 'Team server',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\app\\src\\server',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c9']
    },
    {
      slug: 'd4',
      name: 'CDN',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\cdn',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c10']
    },
    {
      slug: 'd5',
      name: 'Balancer',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\balancer',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c11']
    },
    {
      slug: 'd6',
      name: 'Asset-Maker',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\asset-maker',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c12']
    },
    {
      slug: 'd7',
      name: 'Console',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\console',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c13', 'c14']
    }
  ],

  commands: [
    {
      slug: 'c1',
      name: 'Shell',
      args: ['C:\\Program Files\\Git\\git-bash.exe', '--cd=%dir%'],
      detached: true
    },
    {
      slug: 'c2',
      name: 'Explorer',
      args: ['explorer.exe', '%dir%'],
      detached: true
    },
    {
      slug: 'c3',
      name: 'Git pull FF',
      args: ['git', 'pull', '--ff-only'],
      detached: false
    },
    {
      slug: 'c4',
      name: 'Git GUI',
      args: ['git-gui.exe'],
      detached: true
    },
    {
      slug: 'c5',
      name: 'npm install',
      args: ['npm', 'install'],
      detached: false
    },
    {
      slug: 'c6',
      name: 'vagrant up',
      args: ['vagrant', 'up'],
      detached: false
    },
    {
      slug: 'c7',
      name: 'vagrant up 2',
      args: ['vagrant', 'up'],
      detached: false
    },
    {
      slug: 'c8',
      name: 'npm run dev',
      args: ['npm', 'run', 'dev'],
      detached: false
    },
    {
      slug: 'c9',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c10',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c11',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c12',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c13',
      name: 'npm run watch',
      args: ['npm', 'run', 'watch'],
      detached: false
    },
    {
      slug: 'c14',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    }
  ],

  identifiers: {
    p: 3,
    g: 4,
    d: 8,
    c: 15
  }
}
