using FluentValidation;
using IndustrialIot.Application.DTOs.Asset;

namespace IndustrialIot.Application.Validators;

public class CreateAssetValidator : AbstractValidator<CreateAssetDto>
{
    public CreateAssetValidator()
    {
        RuleFor(x => x.AssetCode)
            .NotEmpty().WithMessage("Asset Code tidak boleh kosong.")
            // Format: TIPE-ZONA-NOMOR (contoh: PMP-A-001)
            .Matches(@"^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$")
            .WithMessage("Format AssetCode tidak valid. Gunakan standar O&G (contoh: PMP-A-001). Hanya huruf kapital, angka, dan dash yang diizinkan.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nama Aset tidak boleh kosong.")
            .MaximumLength(100).WithMessage("Nama Aset maksimal 100 karakter.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Tipe Aset wajib diisi (contoh: Pump, Wellhead).");
            
        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Lokasi wajib diisi.");
    }
}
