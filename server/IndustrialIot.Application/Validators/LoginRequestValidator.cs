using FluentValidation;
using IndustrialIot.Application.DTOs.Auth;

namespace IndustrialIot.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username tidak boleh kosong.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password tidak boleh kosong.");
    }
}
