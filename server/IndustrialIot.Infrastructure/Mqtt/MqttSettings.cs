namespace IndustrialIot.Infrastructure.Mqtt;

public class MqttSettings
{
    public const string SectionName = "Mqtt";

    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 1883;
    public string Username { get; set; } = "backend_service";
    public string Password { get; set; } = "backend_secure_passwd_2026";
    public string ClientId { get; set; } = "industrial_iot_backend";
    public bool UseTls { get; set; } = false;
    public string[] Topics { get; set; } = Array.Empty<string>();
}