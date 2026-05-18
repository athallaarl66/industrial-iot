FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["IndustrialIot.Api/IndustrialIot.Api.csproj", "IndustrialIot.Api/"]
COPY ["IndustrialIot.Application/IndustrialIot.Application.csproj", "IndustrialIot.Application/"]
COPY ["IndustrialIot.Domain/IndustrialIot.Domain.csproj", "IndustrialIot.Domain/"]
COPY ["IndustrialIot.Infrastructure/IndustrialIot.Infrastructure.csproj", "IndustrialIot.Infrastructure/"]

RUN dotnet restore "IndustrialIot.Api/IndustrialIot.Api.csproj"

COPY . .
WORKDIR "/src/IndustrialIot.Api"
RUN dotnet build "IndustrialIot.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IndustrialIot.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IndustrialIot.Api.dll"]
