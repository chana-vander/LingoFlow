# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["LingoFlow.Api/LingoFlow.Api.csproj", "LingoFlow.Api/"]
COPY ["LingoFlow.Core/LingoFlow.Core.csproj", "LingoFlow.Core/"]
COPY ["LingoFlow.Data/LingoFlow.Data.csproj", "LingoFlow.Data/"]
COPY ["LingoFlow.Service/LingoFlow.Service.csproj", "LingoFlow.Service/"]
RUN dotnet restore "./LingoFlow.Api/LingoFlow.Api.csproj"
COPY . .
WORKDIR "/src/LingoFlow.Api"
RUN dotnet build "./LingoFlow.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./LingoFlow.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LingoFlow.Api.dll"]