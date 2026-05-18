using FluentValidation;
using IndustrialIot.Application.DTOs.Auth;

namespace IndustrialIot.Application.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username tidak boleh kosong.")
            .MinimumLength(3).WithMessage("Username minimal 3 karakter.")
            .MaximumLength(50).WithMessage("Username maksimal 50 karakter.")
            .Matches(@"^[a-zA-Z0-9_]+$").WithMessage("Username hanya boleh mengandung huruf, angka, dan underscore.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password tidak boleh kosong.")
            .MinimumLength(6).WithMessage("Password minimal 6 karakter.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email tidak boleh kosong.")
            .EmailAddress().WithMessage("Format email tidak valid.");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Role tidak valid. Gunakan Admin (0) atau Operator (1).");
    }
}
