
```
industrial-iot
├─ apps
├─ infra
│  ├─ .env
│  ├─ docker-compose.yml
│  └─ mosquitto
│     ├─ config
│     ├─ data
│     └─ log
└─ server
   ├─ IndustrialIot.Api
   │  ├─ appsettings.Development.json
   │  ├─ appsettings.json
   │  ├─ bin
   │  │  └─ Debug
   │  │     └─ net8.0
   │  │        ├─ appsettings.Development.json
   │  │        ├─ appsettings.json
   │  │        ├─ IndustrialIot.Api.deps.json
   │  │        ├─ IndustrialIot.Api.dll
   │  │        ├─ IndustrialIot.Api.exe
   │  │        ├─ IndustrialIot.Api.pdb
   │  │        ├─ IndustrialIot.Api.runtimeconfig.json
   │  │        ├─ IndustrialIot.Application.dll
   │  │        ├─ IndustrialIot.Application.pdb
   │  │        ├─ IndustrialIot.Domain.dll
   │  │        ├─ IndustrialIot.Domain.pdb
   │  │        ├─ IndustrialIot.Infrastructure.dll
   │  │        ├─ IndustrialIot.Infrastructure.pdb
   │  │        ├─ Microsoft.AspNetCore.OpenApi.dll
   │  │        ├─ Microsoft.OpenApi.dll
   │  │        ├─ Swashbuckle.AspNetCore.Swagger.dll
   │  │        ├─ Swashbuckle.AspNetCore.SwaggerGen.dll
   │  │        └─ Swashbuckle.AspNetCore.SwaggerUI.dll
   │  ├─ IndustrialIot.Api.csproj
   │  ├─ IndustrialIot.Api.http
   │  ├─ obj
   │  │  ├─ Debug
   │  │  │  └─ net8.0
   │  │  │     ├─ .NETCoreApp,Version=v8.0.AssemblyAttributes.cs
   │  │  │     ├─ apphost.exe
   │  │  │     ├─ Industri.BB5BF28C.Up2Date
   │  │  │     ├─ IndustrialIot.Api.AssemblyInfo.cs
   │  │  │     ├─ IndustrialIot.Api.AssemblyInfoInputs.cache
   │  │  │     ├─ IndustrialIot.Api.assets.cache
   │  │  │     ├─ IndustrialIot.Api.csproj.AssemblyReference.cache
   │  │  │     ├─ IndustrialIot.Api.csproj.CoreCompileInputs.cache
   │  │  │     ├─ IndustrialIot.Api.csproj.FileListAbsolute.txt
   │  │  │     ├─ IndustrialIot.Api.dll
   │  │  │     ├─ IndustrialIot.Api.GeneratedMSBuildEditorConfig.editorconfig
   │  │  │     ├─ IndustrialIot.Api.genruntimeconfig.cache
   │  │  │     ├─ IndustrialIot.Api.GlobalUsings.g.cs
   │  │  │     ├─ IndustrialIot.Api.MvcApplicationPartsAssemblyInfo.cache
   │  │  │     ├─ IndustrialIot.Api.MvcApplicationPartsAssemblyInfo.cs
   │  │  │     ├─ IndustrialIot.Api.pdb
   │  │  │     ├─ ref
   │  │  │     │  └─ IndustrialIot.Api.dll
   │  │  │     ├─ refint
   │  │  │     │  └─ IndustrialIot.Api.dll
   │  │  │     ├─ staticwebassets
   │  │  │     │  ├─ msbuild.build.IndustrialIot.Api.props
   │  │  │     │  ├─ msbuild.buildMultiTargeting.IndustrialIot.Api.props
   │  │  │     │  └─ msbuild.buildTransitive.IndustrialIot.Api.props
   │  │  │     └─ staticwebassets.build.json
   │  │  ├─ IndustrialIot.Api.csproj.nuget.dgspec.json
   │  │  ├─ IndustrialIot.Api.csproj.nuget.g.props
   │  │  ├─ IndustrialIot.Api.csproj.nuget.g.targets
   │  │  ├─ project.assets.json
   │  │  └─ project.nuget.cache
   │  ├─ Program.cs
   │  └─ Properties
   │     └─ launchSettings.json
   ├─ IndustrialIot.Application
   │  ├─ bin
   │  │  └─ Debug
   │  │     └─ net8.0
   │  │        ├─ IndustrialIot.Application.deps.json
   │  │        ├─ IndustrialIot.Application.dll
   │  │        ├─ IndustrialIot.Application.pdb
   │  │        ├─ IndustrialIot.Domain.dll
   │  │        └─ IndustrialIot.Domain.pdb
   │  ├─ Class1.cs
   │  ├─ IndustrialIot.Application.csproj
   │  └─ obj
   │     ├─ Debug
   │     │  └─ net8.0
   │     │     ├─ .NETCoreApp,Version=v8.0.AssemblyAttributes.cs
   │     │     ├─ Industri.60472561.Up2Date
   │     │     ├─ IndustrialIot.Application.AssemblyInfo.cs
   │     │     ├─ IndustrialIot.Application.AssemblyInfoInputs.cache
   │     │     ├─ IndustrialIot.Application.assets.cache
   │     │     ├─ IndustrialIot.Application.csproj.AssemblyReference.cache
   │     │     ├─ IndustrialIot.Application.csproj.CoreCompileInputs.cache
   │     │     ├─ IndustrialIot.Application.csproj.FileListAbsolute.txt
   │     │     ├─ IndustrialIot.Application.dll
   │     │     ├─ IndustrialIot.Application.GeneratedMSBuildEditorConfig.editorconfig
   │     │     ├─ IndustrialIot.Application.GlobalUsings.g.cs
   │     │     ├─ IndustrialIot.Application.pdb
   │     │     ├─ ref
   │     │     │  └─ IndustrialIot.Application.dll
   │     │     └─ refint
   │     │        └─ IndustrialIot.Application.dll
   │     ├─ IndustrialIot.Application.csproj.nuget.dgspec.json
   │     ├─ IndustrialIot.Application.csproj.nuget.g.props
   │     ├─ IndustrialIot.Application.csproj.nuget.g.targets
   │     ├─ project.assets.json
   │     └─ project.nuget.cache
   ├─ IndustrialIot.Domain
   │  ├─ bin
   │  │  └─ Debug
   │  │     └─ net8.0
   │  │        ├─ IndustrialIot.Domain.deps.json
   │  │        ├─ IndustrialIot.Domain.dll
   │  │        └─ IndustrialIot.Domain.pdb
   │  ├─ Class1.cs
   │  ├─ Enums
   │  │  └─ AssetStatus.cs
   │  ├─ IndustrialIot.Domain.csproj
   │  └─ obj
   │     ├─ Debug
   │     │  └─ net8.0
   │     │     ├─ .NETCoreApp,Version=v8.0.AssemblyAttributes.cs
   │     │     ├─ IndustrialIot.Domain.AssemblyInfo.cs
   │     │     ├─ IndustrialIot.Domain.AssemblyInfoInputs.cache
   │     │     ├─ IndustrialIot.Domain.assets.cache
   │     │     ├─ IndustrialIot.Domain.csproj.CoreCompileInputs.cache
   │     │     ├─ IndustrialIot.Domain.csproj.FileListAbsolute.txt
   │     │     ├─ IndustrialIot.Domain.dll
   │     │     ├─ IndustrialIot.Domain.GeneratedMSBuildEditorConfig.editorconfig
   │     │     ├─ IndustrialIot.Domain.GlobalUsings.g.cs
   │     │     ├─ IndustrialIot.Domain.pdb
   │     │     ├─ ref
   │     │     │  └─ IndustrialIot.Domain.dll
   │     │     └─ refint
   │     │        └─ IndustrialIot.Domain.dll
   │     ├─ IndustrialIot.Domain.csproj.nuget.dgspec.json
   │     ├─ IndustrialIot.Domain.csproj.nuget.g.props
   │     ├─ IndustrialIot.Domain.csproj.nuget.g.targets
   │     ├─ project.assets.json
   │     └─ project.nuget.cache
   ├─ IndustrialIot.Infrastructure
   │  ├─ bin
   │  │  └─ Debug
   │  │     └─ net8.0
   │  │        ├─ IndustrialIot.Application.dll
   │  │        ├─ IndustrialIot.Application.pdb
   │  │        ├─ IndustrialIot.Domain.dll
   │  │        ├─ IndustrialIot.Domain.pdb
   │  │        ├─ IndustrialIot.Infrastructure.deps.json
   │  │        ├─ IndustrialIot.Infrastructure.dll
   │  │        └─ IndustrialIot.Infrastructure.pdb
   │  ├─ Class1.cs
   │  ├─ IndustrialIot.Infrastructure.csproj
   │  ├─ obj
   │  │  ├─ Debug
   │  │  │  └─ net8.0
   │  │  │     ├─ .NETCoreApp,Version=v8.0.AssemblyAttributes.cs
   │  │  │     ├─ Industri.48D2A46C.Up2Date
   │  │  │     ├─ IndustrialIot.Infrastructure.AssemblyInfo.cs
   │  │  │     ├─ IndustrialIot.Infrastructure.AssemblyInfoInputs.cache
   │  │  │     ├─ IndustrialIot.Infrastructure.assets.cache
   │  │  │     ├─ IndustrialIot.Infrastructure.csproj.AssemblyReference.cache
   │  │  │     ├─ IndustrialIot.Infrastructure.csproj.CoreCompileInputs.cache
   │  │  │     ├─ IndustrialIot.Infrastructure.csproj.FileListAbsolute.txt
   │  │  │     ├─ IndustrialIot.Infrastructure.dll
   │  │  │     ├─ IndustrialIot.Infrastructure.GeneratedMSBuildEditorConfig.editorconfig
   │  │  │     ├─ IndustrialIot.Infrastructure.GlobalUsings.g.cs
   │  │  │     ├─ IndustrialIot.Infrastructure.pdb
   │  │  │     ├─ ref
   │  │  │     │  └─ IndustrialIot.Infrastructure.dll
   │  │  │     └─ refint
   │  │  │        └─ IndustrialIot.Infrastructure.dll
   │  │  ├─ IndustrialIot.Infrastructure.csproj.nuget.dgspec.json
   │  │  ├─ IndustrialIot.Infrastructure.csproj.nuget.g.props
   │  │  ├─ IndustrialIot.Infrastructure.csproj.nuget.g.targets
   │  │  ├─ project.assets.json
   │  │  └─ project.nuget.cache
   │  └─ Persistence
   │     └─ AppDbContext.cs
   └─ IndustrialIot.sln

```"# industrial-iot" 
