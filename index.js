// Copyright (c)2025 Quinn Michaels
// Guard Deva
import Deva from '@indra.ai/deva';
import pkg from './package.json' with {type:'json'};
const {agent,vars} = pkg.data;

import {exec, spawn}  from 'node:child_process';

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

const info = {
  id: pkg.id,
  name: pkg.name,
  describe: pkg.description,
  version: pkg.version,
  url: pkg.homepage,
  dir: __dirname,
  git: pkg.repository.url,
  bugs: pkg.bugs.url,
  author: pkg.author,
  license: pkg.license,
  copyright: pkg.copyright,
};

const GUARD = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();},
  },
  listeners: {
    'devacore:question'(packet) {
      this.func.echostr(packet.q);
    },
    'devacore:answer'(packet) {
      this.func.echostr(packet.a);
    }
  },
  modules: {},
  deva: {},
  func: {
    echostr(opts) {
      const {id, agent, client, md5, sha256, sha512} = opts;
      const created = Date.now();
    
      this.action('func', `echostr:${id}`);
      this.state('set', `echostr:${id}`);
      const echostr = [
        `::begin:guard:${id}`,
        `transport: ${id}`, 
        `client: ${client.profile.id}`, 
        `agent: ${agent.profile.id}`, 
        `created: ${created}`, 
        `md5: ${md5}`, 
        `sha256:${sha256}`, 
        `sha512:${sha512}`,
        `::end:guard:${id}`,
      ].join('\nliek');
    
      // stub for later features right now just echo into the system process for SIGINT monitoring.
      const echo = spawn('echo', [echostr])
      echo.stderr.on('data', err => {
        this.error(err, opts);
      });
      
      this.state('return', `echostr:${id}`);
      return echostr;
    }    
  },
  methods: {},
  onReady(data, resolve) {
    this.prompt(this.vars.messages.ready);
    return resolve(data);
  },
  onError(err, data, reject) {
    this.prompt(this.vars.messages.error);
    console.log(err);
    return reject(err);
  }
});
export default GUARD
