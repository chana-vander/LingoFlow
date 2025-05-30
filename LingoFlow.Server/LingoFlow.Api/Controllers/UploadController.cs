using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.Runtime;
using DotNetEnv;
using System;
using Amazon;

namespace MagicalMusic.Api.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        // Constructor
        public UploadController()
        {
            // ���� �� ����� ������ ���� ���� .env
            Env.Load();
            Console.WriteLine($"Current Directory: {System.IO.Directory.GetCurrentDirectory()}");

            // ����� �� ����� ���� ���� �-ENV
            var accessKey = Env.GetString("AWS__AccessKey");
            Console.WriteLine("accessKey: "+ accessKey);
            var secretKey = Env.GetString("AWS__SecretKey");
            var region = Env.GetString("AWS__Region");
            var bucketName = Env.GetString("AWS__BucketName");

            // �� ��� ������� ���, �� ������ �� ������
            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(region) || string.IsNullOrEmpty(bucketName))
            {
                throw new ArgumentNullException("AWS credentials or region are missing from the .env file");
            }

            // ����� ����� �� S3
            var config = new AmazonS3Config
            {
                RegionEndpoint = RegionEndpoint.GetBySystemName(region)  // ����� �����
            };

            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            _s3Client = new AmazonS3Client(credentials, config);
        }

        // ������� ����� URL �� PUT ������ ���-�����
        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            // ����� �� �� ���� ��-ENV
            var bucketName = Env.GetString("AWS__BucketName");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(60),
                ContentType = "audio/mp3" // ��� ����� ������
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }

        // ����� URL ���� ���� ������ ���� (������)
        [HttpGet("download-url")]
        public IActionResult GetDownloadPresignedUrl([FromQuery] string fileName)
        {
            var bucketName = Env.GetString("AWS__BucketName");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires=DateTime.UtcNow.AddDays(300)
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }
    }
}
