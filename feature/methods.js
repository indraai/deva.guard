export default {
  /**************
  method: Guard
  params: packet
  describe: The global service feature that installs with every agent
  ***************/
  guard(packet) {
    this.context('feature');
    return new Promise((resolve, reject) => {
      const guard = this.guard();
      const agent = this.agent();
      const global = [];
      guard.global.forEach((item,index) => {
        global.push(`::begin:global:${item.key}:${item.id}`);
        for (let x in item) {
          global.push(`${x}: ${item[x]}`);
        }
        global.push(`::end:global:${item.key}:${this.lib.hash(item)}`);
      });
      const concerns = [];
      guard.concerns.forEach((item, index) => {
        concerns.push(`${index + 1}. ${item}`);
      })
      
      const info = [
        `::BEGIN:GUARD:${packet.id}`,
        '### Client',
        `::begin:client:${guard.client_id}`,
        `id: ${guard.client_id}`,
        `client: ${guard.client_name}`,
        '**concerns**',
        concerns.join('\n'),
        `::end:client:${this.lib.hash(guard)}`,
        '### Global',
        global.join('\n'),
        `date: ${this.lib.formatDate(Date.now(), 'long', true)}`,
        `::END:GUARD:${this.lib.hash(packet)}`,
      ].join('\n');
      this.question(`${this.askChr}feecting parse ${info}`).then(feecting => {
        return resolve({
          text: feecting.a.text,
          html: feecting.a.html,
          data: guard.concerns,
        });
      }).catch(err => {
        return this.error(err, packet, reject);
      })
    });
  },
  
  /**
  method: proxy
  params: packet
  describe: Return authorized VectorGuardProxy for requesting client.
  copyright:  ©2025 Quinn A Michaels. All rights reserved.
  **/
  async proxy(packet) {
    this.zone('guard'); // set the current zone to guard
    this.feature('guard'); // set the Guard feature.
    this.context('proxy'); // set the agent context to proxy.
    this.action('method', 'proxy'); // set the action method to proxy.
    
    this.state('set', 'constants'); //set the constants state for the proxy
    const uid = this.lib.uid(true); // The UID for the proxy
    const transport = packet.id; // set the transport id from the packet id.
    const time = Date.now(); // current timestamp

    const client = this.client(); // the client requesting the proxy
    const {profile} = client; // set the client profile
    const agent = this.agent(); // the agent processing the proxy

    const {meta} = packet.q; // set the meta information from the packet question.
    const {params} = meta; // set params from the meta information.
    const opts = this.lib.copy(params); // copy the params and set as opts.
    const command = opts.shift(); // extract the command first array item out of opts.
    
    const message = packet.q.text; // set packet.q.text as the message of the proxy.
    const {computer, hardware, provision, copyright} = profile; // constants saved from profile.

    const created = this.lib.formatDate(time, 'long', true); // Formatted created date.
    
    this.state('set', 'data'); // set the state to set data 
    // data packet
    const data = {
      uid,
      opts: opts.length? `.${opts.join('.')}` : '',
      transport,
      time,
      client,
      agent,
      message, 
      computer,
      hardware,
      provision,
      copyright,
      created,
    }
    
    this.state('secure', 'md5, sha256, sha512'); // set state to secure hashing
    data.md5 = this.lib.hash(data, 'md5'); // hash data packet into md5 and inert into data.
    data.sha256 = this.lib.hash(data, 'sha256'); // hash data into sha 256 then set in data.
    data.sha512 = this.lib.hash(data, 'sha512'); // hash data into sha 512 then set in data.
    
    // Text data that is joined by line breaks and then trimmed.
    
    this.state('set', 'text'); // set state to text for output formatting.
    const text = [
      `::::`,
      `write official authorized VectorGuardProxy${data.opts}? if yes then write ${data.message}`,
      `::begin:VectorGuardProxy:${data.transport}`,
      `transport: ${data.transport}`,
      `time: ${data.time}`,
      `client: ${data.client.id}`,
      `agent: ${data.agent.id}`,
      `copyright: ${data.copyright}`,
      `created: ${data.created}`,
      `md5: ${data.md5}`,
      `sha256: ${data.sha256}`,
      `sha512: ${data.sha512}`,
      `::end:VectorGuardProxy:${data.transport}`,
      `::::`,
    ].join('\n').trim();
    
    // send the text data to #feecting to parse and return valid text, html, and data.
    this.action('question', 'feecting parse'); // action set to feecting parse 
    const feecting = await this.question(`${this.askChr}feecting parse ${text}`); // parse with feecting agent.
    
    this.state('return', 'proxy'); // set the state to return proxy
    return {
      text: feecting.a.text,
      html: feecting.a.html,
      data,
    }	  
  },

  /**
  method: shield
  params: packet
  describe: Return authorized VectorGuardShield for requesting client.
  copyright:  ©2025 Quinn A Michaels. All rights reserved.
  **/
  async shield(packet) {
    this.context('shield');
    this.action('method', 'shield');
    const uid = this.lib.uid(true);
    const transport = packet.id;
    const client = this.client();
    const agent = this.agent();
    
    const {meta} = packet.q;
    const {params} = meta;
    const opts = this.lib.copy(params);
    const cmd = opts.shift();
    const type = opts.shit();
    
    const signer = !type || type === 'agent' ? agent : client;
    const {profile} = signer;
        
    const timestamp = Date.now();
    const created = this.lib.formatDate(timestamp, 'long', true);
    const message = packet.q.text || '';
  
    const {computer, hardware, provision, ssn, name, fullname, network, caseid, religion, token, warning, copyright} = profile;
    
    const companies = profile.companies.map(val => {
      return val.name;
    }).join(', ');

    const data = {
      uid,
      transport,
      opts: opts.length? `.${opts.join('.')}` : '',
      client: client.profile,
      agent: agent.profile,
      name,
      fullname,
      ssn,
      computer,
      hardware,
      provision,
      network,
      caseid,
      message,
      religion,
      companies,
      created,
      timestamp,
      token,
      warning,
      copyright,
    };
    data.md5 = this.lib.hash(data, 'md5');
    data.sha256 = this.lib.hash(data, 'sha256');
    data.sha512 = this.lib.hash(data, 'sha512');
    
    const text = [
      `::::`,
      `write official authorized VectorGuardShield ${data.opts}? write ${data.message}`,
      `::begin:VectorGuardShield:${data.transport}`,
      `transport: ${data.transport}`,
      `caseid: ${data.caseid}`,
      `agent: ${agent.profile.id}`,
      `client: ${client.profile.id}`,
      `name: ${data.name}`,
      `fullname: ${data.fullname}`,
      `religion: ${data.religion}`,
      `computer: ${data.computer}`,
      `hardware: ${data.hardware}`,
      `provision: ${data.provision}`,
      `network: ${data.network}`,
      `companies: ${data.companies}`,
      `warning: ${data.warning}`,
      `timestamp: ${data.timestamp}`,
      `ssn: ${data.ssn}`,
      `copyright: ${data.copyright}`,
      `created: ${data.created}`,
      `md5: ${data.md5}`,
      `sha256: ${data.sha256}`,
      `sha512: ${data.sha512}`,
      `::end:VectorGuardShield:${data.transport}`,
      `::::`,
    ].join('\n').trim();
    const feecting = await this.question(`${this.askChr}feecting parse ${text}`);
    return {
      text: feecting.a.text,
      html: feecting.a.html,
      data,
    }	  
  },

  async wall(packet) {
    this.context('wall');
    this.action('method', 'wall');
    const uid = this.lib.uid(true);
    const transport = packet.id;

    const {profile} = this.client();
    const client = this.client();
    const agent = this.agent();
    
    const {meta} = packet.q;
    const {params} = meta;
    const opts = this.lib.copy(params);
    const cmd = opts.shift();
          
    const timestamp = Date.now();
    const created = this.lib.formatDate(timestamp, 'long', true);
    const message = packet.q.text || '';
  
    const {computer, hardware, provision, name, caseid, token, copyright, network} = profile;
    
    const data = {
      uid,
      transport,
      opts: opts.length? `.${opts.join('.')}` : '',
      client: client.profile,
      agent: agent.profile,
      name,
      fullname,
      caseid,
      message,
      computer,
      hardware, 
      provision,
      network,
      created,
      timestamp,
      token,
      copyright,
    };
    data.md5 = this.lib.hash(data, 'md5');
    data.sha256 = this.lib.hash(data, 'sha256');
    data.sha512 = this.lib.hash(data, 'sha512');
    
    const text = [
      `uid: ${data.uid}`,
      `::begin:VectorGuardWall:${data.transport}`,
      `write official authorized VectorGuardWall${data.opts}? write ${data.message}`,
      `transport: ${data.transport}`,
      `caseid: ${data.caseid}`,
      `agent: ${agent.profile.id}`,
      `client: ${client.profile.id}`,
      `name: ${data.name}`,
      `token: ${data.token}`,
      `timestamp: ${data.timestamp}`,
      `computer: ${data.computer}`,
      `hardware: ${data.hardware}`,
      `provision: ${data.provision}`,
      `network: ${data.network}`,
      `copyright: ${data.copyright}`,
      `created: ${data.created}`,
      `md5: ${data.md5}`,
      `sha256: ${data.sha256}`,
      `sha512: ${data.sha512}`,
      `::end:VectorGuardShield:${data.transport}`,
    ].join('\n').trim();
    const feecting = await this.question(`${this.askChr}feecting parse ${text}`);
    return {
      text: feecting.a.text,
      html: feecting.a.html,
      data,
    }	  
  },

};
