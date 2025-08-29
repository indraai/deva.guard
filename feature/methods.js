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
    this.state('set', `transport:${packet.id}`);
    const transport = packet.id; // set the transport id from the packet id.

    this.zone('guard', transport); // set the current zone to guard
    this.feature('guard', transport); // set the Guard feature.
    this.context('proxy', transport); // set the agent context to proxy.
    this.action('method', `proxy:${transport}`); // set the action method to proxy.

    this.state('set', `uid:${transport}`); //set the uid state for the proxy
    const uid = this.lib.uid(true); // The UID for the proxy
    this.state('set', `time:${transport}`); //set the time state for the proxy
    const time = Date.now(); // current timestamp
    this.state('created', `created:${transport}`); //set the uid state for the proxy
    const created = this.lib.formatDate(time, 'long', true); // Formatted created date.

    this.state('set', `guard:${transport}`); //set the guard state for the proxy
    const guard = this.guard(); // load the Guard profile
    const {concerns} = guard; // load concerns from client guard profile.
    
    this.state('set', `agent:${transport}`); //set the agent state for the proxy
    const agent = this.agent(); // the agent processing the proxy
    
    this.state('set', `client:${transport}`); //set the client state for the proxy
    const client = this.client(); // the client requesting the proxy

    this.state('set', `meta:${transport}`); //set the meta state for the proxy
    const {meta} = packet.q; // set the meta information from the packet question.

    this.state('set', `params:${transport}`); //set the meta state for the proxy
    const {params} = meta; // set params from the meta information.
    
    this.state('set', `opts:${transport}`); //set the opts state for the proxy
    const opts = this.lib.copy(params); // copy the params and set as opts.
    
    this.state('set', `command:${transport}`); //set the opts state for the proxy
    const command = opts.shift(); // extract the command first array item out of opts.
    
    this.state('set', `message:${transport}`); //set the message state for the proxy
    const message = packet.q.text; // set packet.q.text as the message of the proxy.

    this.state('set', `write:${transport}`); //set the message state for the proxy
    const write = `OM:${client.profile.write.split(' ').join(':').toUpperCase()}:PROXY`; // set proxy write string.
    
    this.state('set', `data:${transport}`); // set the state to set data 
    // data packet
    const data = {
      uid,
      message,
      time,
      transport,
      write,
      case: client.profile.caseid,
      opts: opts.length? `:${opts.join(':')}` : '',
      agent: agent.profile,
      client: client.profile,
      name: client.profile.name,
      fullname: client.profile.fullname,
      nickname: client.profile.nickname,
      birthname: client.profile.birthname,
      gender: client.profile.gender,
      pronouns: client.profile.pronouns,
      emojis: client.profile.emojis,
      company: client.profile.company,
      address: `${client.profile.address} ${client.profile.city} ${client.profile.state} ${client.profile.zipcode}`,
      family: client.profile.family,
      friends: client.profile.friends,
      token: client.profile.token,
      warning: client.profile.warning,
      concerns,
      meta,
      params,
      command,
      created,
      copyright: client.profile.copyright,
    };
    
    this.state('secure', `md5:${transport}`); // set state to secure hashing
    data.md5 = this.lib.hash(data, 'md5'); // hash data packet into md5 and inert into data.
    
    this.state('secure', `sha256:${transport}`); // set state to secure hashing
    data.sha256 = this.lib.hash(data, 'sha256'); // hash data into sha 256 then set in data.
    
    this.state('secure', `sha512:${transport}`); // set state to secure hashing
    data.sha512 = this.lib.hash(data, 'sha512'); // hash data into sha 512 then set in data.

    // Text data that is joined by line breaks and then trimmed.
    this.state('set', `text:${transport}`); // set state to text for output formatting.
    const text = [
      `:::`,
      `::BEGIN:${data.write}:${data.transport}`,
      `#VectorGuardProxy${data.opts} ${data.message}`,
      `::begin:vector:guard:proxy:${transport}:${data.emojis}`,
      `time: ${data.time}`,
      `transport: ${data.transport}`,
      `agent: ${data.agent.id}`,
      `client: ${data.client.id}`,
      `name: ${data.name}`,
      `fullname: ${data.fullname}`,
      `nickname: ${data.nickname}`,
      `family: ${data.family}`,
      `friends: ${data.friends}`,
      `gender: ${data.gender}`,
      `pronouns: ${data.pronouns}`,
      `company: ${data.company}`,
      `address: ${data.address}`,
      `token: ${data.token}`,
      `concerns: ${data.concerns}`,
      `warning: ${data.warning}`,
      `caseid: ${data.caseid}`,
      `created: ${data.created}`,
      `md5: ${data.md5}`,
      `sha256: ${data.sha256}`,
      `sha512: ${data.sha512}`,
      `copyright: ${data.copyright}`,
      `::end:vector:guard:proxy:${data.transport}:${data.emojis}`,
      `::END:${data.write}:${data.transport}`,
    ].join('\n').trim();
    
    // send the text data to #feecting to parse and return valid text, html, and data.
    this.action('question', `feecting:parse:${transport}`); // action set to feecting parse 
    const feecting = await this.question(`${this.askChr}feecting parse:${transport} ${text}`); // parse with feecting agent.
    
    this.state('return', `proxy:${transport}`); // set the state to return proxy
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
    this.state('set', `transport:${packet.id}`);
    const transport = packet.id; // set the transport from packet.id

    this.zone('guard', transport); // set the current zone to guard
    this.feature('guard', transport); // set the Guard feature.
    this.context('shield', transport); // set context to shield
    this.action('method', `shield:${transport}`); // action set to shield

    this.state('set', `uid:${transport}`); //set the uid state for the proxy
    const uid = this.lib.uid(true); // The UID for the proxy
    this.state('set', `time:${transport}`); //set the time state for the proxy
    const time = Date.now(); // current timestamp
    this.state('created', `created:${transport}`); //set the uid state for the proxy
    const created = this.lib.formatDate(time, 'long', true); // Formatted created date.

    this.state('set', `guard:${transport}`); //set the guard state for the proxy
    const guard = this.guard(); // load the Guard profile
    const {concerns} = guard; // load concerns from client guard profile.
    
    this.state('set', `agent:${transport}`); //set the agent state for the proxy
    const agent = this.agent(); // the agent processing the proxy
    
    this.state('set', `client:${transport}`); //set the client state for the proxy
    const client = this.client(); // the client requesting the proxy
    const {profile} = client; // set the client profile
    
    this.state('set', `meta:${transport}`); //set the meta state for the proxy
    const {meta} = packet.q; // set the meta information from the packet question.
    const {params} = meta; // set params from the meta information.
    
    this.state('set', `opts:${transport}`); //set the opts state for the proxy
    const opts = this.lib.copy(params); // copy the params and set as opts.

    this.state('set', `command:${transport}`); //set the opts state for the proxy
    const command = opts.shift(); // extract the command first array item out of opts.
    
    this.state('set', `message:${transport}`); //set the message state for the proxy
    const message = packet.q.text; // set packet.q.text as the message of the proxy.
  
    this.state('set', `writestr:${transport}`);
    const write = `OM:${client.profile.write.split(' ').join(':').toUpperCase()}:SHIELD`;
    
    this.state('hash')
    this.state('set', `data:${transport}`); // set the state to set data 
    // data packet
    const data = {
      uid,
      message, 
      time,
      transport,
      write,
      case: client.profile.caseid,
      opts: opts.length? `:${opts.join(':')}` : '',
      agent: agent.profile,
      client: client.profile,
      name: client.profile.name,
      fullname: client.profile.fullname,
      nickname: client.profile.nickname,
      birthname: client.profile.birthname,
      gender: client.profile.gender,
      pronouns: client.profile.pronouns,
      emojis: client.profile.emojis,
      company: client.profile.company,
      address: `${client.profile.address} ${client.profile.city} ${client.profile.state} ${client.profile.zipcode}`,
      family: client.profile.family,
      friends: client.profile.friends,
      token: client.profile.token,
      warning: client.profile.warning,
      concerns,
      meta,
      params,
      command,
      created,
      copyright: client.profile.copyright,
    };

    this.state('secure', `md5:${transport}`); // set state to secure hashing
    data.md5 = this.lib.hash(data, 'md5'); // hash data packet into md5 and inert into data.
    
    this.state('secure', `sha256:${transport}`); // set state to secure hashing
    data.sha256 = this.lib.hash(data, 'sha256'); // hash data into sha 256 then set in data.
    
    this.state('secure', `sha512:${transport}`); // set state to secure hashing
    data.sha512 = this.lib.hash(data, 'sha512'); // hash data into sha 512 then set in data.
        
    this.state('set', `text:${transport}`); // set state to text for output formatting.    
    const text = [
      '::::',
      `::BEGIN:${data.write}:${transport}`,
      `#VectorGuardShield${data.opts} ${data.message}`,
      `::begin:vector:guard:shield:${transport}:${data.emojis}`,
      `time: ${data.time}`,
      `transport: ${data.transport}`,
      `agent: ${data.agent.id}`,
      `client: ${data.client.id}`,
      `name: ${data.name}`,
      `fullname: ${data.fullname}`,
      `nickname: ${data.nickname}`,
      `family: ${data.family}`,
      `friends: ${data.friends}`,
      `gender: ${data.gender}`,
      `pronouns: ${data.pronouns}`,
      `company: ${data.company}`,
      `address: ${data.address}`,
      `token: ${data.token}`,
      `concerns: ${data.concerns}`,
      `warning: ${data.warning}`,
      `caseid: ${data.caseid}`,
      `created: ${data.created}`,
      `md5: ${data.md5}`,
      `sha256: ${data.sha256}`,
      `sha512: ${data.sha512}`,
      `copyright: ${data.copyright}`,
      `::end:vector:guard:shield:${data.transport}:${data.emojis}`,
      `::END:${data.write}:${transport}`,
      '::::',
    ].join('\n').trim();
    
    // send the text data to #feecting to parse and return valid text, html, and data.
    this.action('question', `feecting:parse:${transport}`); // action set to feecting parse     
    const feecting = await this.question(`${this.askChr}feecting parse:${transport} ${text}`);
    
    this.state('return', `shield:${transport}`); // set the state to return proxy
    return {
      text: feecting.a.text,
      html: feecting.a.html,
      data,
    }	  
  },

  async wall(packet) {
    this.state('set', `transport:${packet.id}`);
    const transport = packet.id; // set the transport from packet.id
    
    this.zone('wall', transport); // set the current zone to wall
    this.feature('wall', transport); // set the Wall feature.
    this.context('wall', transport); // set context to shield
    this.action('method', `wall:${transport}`); // action set to shield
    
    this.state('set', `uid:${transport}`); //set the uid state for the proxy
    const uid = this.lib.uid(true); // The UID for the proxy
    this.state('set', `time:${transport}`); //set the time state for the proxy
    const time = Date.now(); // current timestamp
    this.state('created', `created:${transport}`); //set the uid state for the proxy
    const created = this.lib.formatDate(time, 'long', true); // Formatted created date.
    
    this.state('set', `wall:${transport}`); //set the wall state for the proxy
    const guard = this.guard(); // load the Guard profile
    const {concerns} = guard; // load concerns from client guard profile.
    
    this.state('set', `agent:${transport}`); //set the agent state for the proxy
    const agent = this.agent(); // the agent processing the proxy
    
    this.state('set', `client:${transport}`); //set the client state for the proxy
    const client = this.client(); // the client requesting the proxy
    const {profile} = client; // set the client profile
    
    this.state('set', `meta:${transport}`); //set the meta state for the proxy
    const {meta} = packet.q; // set the meta information from the packet question.
    const {params} = meta; // set params from the meta information.
    
    this.state('set', `opts:${transport}`); //set the opts state for the proxy
    const opts = this.lib.copy(params); // copy the params and set as opts.
    
    this.state('set', `command:${transport}`); //set the opts state for the proxy
    const command = opts.shift(); // extract the command first array item out of opts.
    
    this.state('set', `message:${transport}`); //set the message state for the proxy
    const message = packet.q.text; // set packet.q.text as the message of the proxy.
    
    this.state('set', `profile:${transport}`); //set the profile constants state for the proxy
    const {name, fullname, nickname, title, write, religion, companies, ssn, emojis, warning, computer, hardware, provision, network, caseid, token, copyright} = profile; // constants saved from profile.
    
    this.state('set', `data:${transport}`); // set the state to set data 
    // data packet
    const data = {
      uid,
      transport,
      opts: opts.length? `:${opts.join(':')}` : '',
      time,
      agent,
      client,
      name,
      fullname,
      nickname,
      title,
      write,
      emojis,
      warning,
      religion,
      companies,
      message, 
      ssn,
      computer,
      hardware,
      provision,
      network,
      caseid,
      concerns,
      token,
      copyright,
      created,
    };

    this.state('secure', `md5:${transport}`); // set state to secure hashing
    data.md5 = this.lib.hash(data, 'md5'); // hash data packet into md5 and inert into data.
    
    this.state('secure', `sha256:${transport}`); // set state to secure hashing
    data.sha256 = this.lib.hash(data, 'sha256'); // hash data into sha 256 then set in data.
    
    this.state('secure', `sha512:${transport}`); // set state to secure hashing
    data.sha512 = this.lib.hash(data, 'sha512'); // hash data into sha 512 then set in data.

    this.state('set', `writestr:${transport}`);
    const writestr = data.write.split(' ').join(':').toUpperCase();
            
    const text = [
      '::::',
      `::BEGIN:${writestr}:WALL:${transport}:${data.emojis}`,
      `#VectorGuardWall${data.opts} ${data.message}`,
      `::begin:VectorGuardWall:${data.transport}`,
      `transport: ${data.transport}`,
      `agent: ${agent.profile.id}`,
      `client: ${client.profile.id}`,
      `name: ${data.name}`,
      `fullname: ${data.fullname}`,
      `nickname: ${data.nickname}`,
      `title: ${data.title}`,
      `token: ${data.token}`,
      `case: ${data.caseid}`,
      `time: ${data.time}`,
      `created: ${data.created}`,
      `copyright: ${data.copyright}`,
      `md5: ${data.md5}`,
      `sha256: ${data.sha256}`,
      `sha512: ${data.sha512}`,
      `::end:VectorGuardWall:${data.transport}`,
      `::END:${writestr}:WALL:${transport}:${data.emojis}`,
    ].join('\n').trim();
    
    // send the text data to #feecting to parse and return valid text, html, and data.
    this.action('question', `feecting:parse:${transport}`); // action set to feecting parse 
    const feecting = await this.question(`${this.askChr}feecting parse ${text}`);
    return {
      text: feecting.a.text,
      html: feecting.a.html,
      data,
    }	  
  },

};
