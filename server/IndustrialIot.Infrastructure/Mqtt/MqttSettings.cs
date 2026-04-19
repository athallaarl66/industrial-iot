namespace IndustrialIot.Infrastructure.Mqtt;

public class MqttSettings
{
    public const string SectionName = "Mqtt";

    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 1883;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ClientId { get; set; } = "industrial_iot_backend";
    public bool UseTls { get; set; } = false;
    public string[] Topics { get; set; } = Array.Empty<string>();
}