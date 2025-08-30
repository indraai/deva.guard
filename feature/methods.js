export default {
  /**************
  method: guard
  params: packet
  describe: The global guard feature that installs with every agent
  ***************/
  async guard(packet) {
    const guard = await this.methods.sign('guard', 'default', packet);
    return guard;
  },
};
