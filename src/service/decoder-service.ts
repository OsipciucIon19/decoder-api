class DecoderService {
  decodePayload(hexPayload: string) {
    const payload = Buffer.from(hexPayload, 'hex');
    let value: number;

    // Extracting sensor data from the payload
    value = payload[2] << 8 | payload[3];
    if (payload[2] & 0x80) {
      value |= 0xFFFF0000;
    }
    const temperature = (value / 100) // SHT20, temperature, units: °C

    value = payload[4] << 8 | payload[5];
    const humidity = (value / 10) // SHT20, Humidity, units: %

    value = (payload[0] << 8 | payload[1]) & 0x3FFF;
    const battery = value / 1000; // Battery, units: mV

    value = payload[7] << 8 | payload[8];
    if (payload[7] & 0x80) {
      value |= 0xFFFF0000;
    }
    const temperatureExt = (value / 100); // DS18B20, temperature, units: °C

    // Creating the decoded object
    return {
      temperature,
      humidity,
      battery,
      temperatureExt
    };
  }
}

module.exports = new DecoderService();
