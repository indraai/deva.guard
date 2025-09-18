"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under VLA:51699275776036264337 LICENSE.md

const {expect} = require('chai')
const GuardDeva = require('./index.js');

describe(GuardDeva.me.name, () => {
  beforeEach(() => {
    return GuardDeva.init()
  });
  it('Check the DEVA Object', () => {
    expect(GuardDeva).to.be.an('object');
    expect(GuardDeva).to.have.property('agent');
    expect(GuardDeva).to.have.property('vars');
    expect(GuardDeva).to.have.property('listeners');
    expect(GuardDeva).to.have.property('methods');
    expect(GuardDeva).to.have.property('modules');
  });
})
