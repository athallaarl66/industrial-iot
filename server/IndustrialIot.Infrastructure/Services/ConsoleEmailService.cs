using IndustrialIot.Application.Services;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace IndustrialIot.Infrastructure.Services;

public class ConsoleEmailService : IEmailService
{
    private readonly ILogger<ConsoleEmailService> _logger;

    public ConsoleEmailService(ILogger<ConsoleEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string toEmail, string subject, string body)
    {
        _logger.LogInformation("\n" +
            "====================================================\n" +
            "               KOTAK SURAT VIRTUAL (DEV)           \n" +
            "----------------------------------------------------\n" +
            "KEPADA  : {ToEmail}\n" +
            "SUBJEK  : {Subject}\n" +
            "----------------------------------------------------\n" +
            "{Body}\n" +
            "====================================================", 
            toEmail, subject, body);

        return Task.CompletedTask;
    }
}
