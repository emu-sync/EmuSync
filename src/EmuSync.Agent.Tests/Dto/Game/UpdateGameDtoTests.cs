using EmuSync.Agent.Dto.Game;
using System.Text.Json;

namespace EmuSync.Agent.Tests.Dto.Game;

public class UpdateGameDtoTests
{
    [Fact]
    public void DeserialisesCorrectly()
    {
        var json = """
        {
          "id": "i",
          "name": "n",
          "autoSync": true,
          "syncSourceIdLocations": { "s": "p" },
          "maximumLocalGameBackups": 4,
          "ignoredFilePaths": [ "config.ini" ]
        }
        """;

        var dto = JsonSerializer.Deserialize<UpdateGameDto>(json);

        Assert.NotNull(dto);
        Assert.Equal("i", dto.Id);
        Assert.Equal("n", dto.Name);
        Assert.True(dto.AutoSync);
        Assert.Equal(4, dto.MaximumLocalGameBackups);
        Assert.Equal(["config.ini"], dto.IgnoredFilePaths);
    }

    [Theory]
    [InlineData("config.ini", true)]
    [InlineData("sub/cache.bin", true)]
    [InlineData("sub\\cache.bin", true)]
    [InlineData("", false)]
    [InlineData("../outside.txt", false)]
    [InlineData("sub/../../outside.txt", false)]
    [InlineData("/rooted.txt", true)]
    [InlineData("C:\\rooted.txt", false)]
    public void Validator_Checks_IgnoredFilePaths(string path, bool expectedValid)
    {
        var dto = new UpdateGameDto
        {
            Id = "i",
            Name = "n",
            IgnoredFilePaths = [path]
        };

        var result = new UpdateGameDtoValidator().Validate(dto);

        Assert.Equal(expectedValid, result.IsValid);
    }
}
