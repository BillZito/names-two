#include <aws/s3/S3Client.h>
#include <aws/s3/model/PutObjectRequest.h>
#include <aws/s3/model/GetObjectRequest.h>
#include <aws/core/Aws.h>
#include <aws/core/utils/memory/stl/AWSStringStream.h>
#include <iostream>

using namespace Aws::S3;
using namespace Aws::S3::Model;

static const char* KEY = "s3_cpp_sample_key";
static const char* BUCKET = "invalidmemories";

int main() 
{
  std::cout << "hello twirl" << std::endl;
  Aws::SDKOptions options;
  Aws::InitAPI(options);
  {
    // try setting region
    Aws::Client::ClientConfiguration myConf;
    myConf.region = Aws::Region::US_WEST_1;
    Aws::S3::S3Client client(myConf);
    // S3Client client;

    PutObjectRequest putObjectRequest;
    putObjectRequest.WithKey(KEY)
      .WithBucket(BUCKET);

      auto requestStream = Aws::MakeShared<Aws::StringStream>("s3-sample");
      *requestStream << "Hello World";

      putObjectRequest.SetBody(requestStream);
      auto putObjectOutcome = client.PutObject(putObjectRequest);

      if(putObjectOutcome.IsSuccess())
      {
        std::cout << "Put object succeeded" << std::endl;
      }
      else
      {
        std::cout << "Error while putting object " << putObjectOutcome.GetError().GetExceptionName() 
          << " " << putObjectOutcome.GetError().GetMessage() << std::endl; 
      }
  }
  Aws::ShutdownAPI(options);
  return 0;
}


// int main(){
//   std::cout << "hello twirl" << std::endl;
// }

// #include <aws/core/Aws.h>
// SDKOptions options;
// Aws::InitAPI(options)

// Aws::S3::S3Client s3Client;
// GetObjectRequest getObjectRequest;

// getObjectRequest.SetBucket("invalidmemories");
// getObjectRequest.SetKey("Billy Won.jpg"); //needs to be sdk key?
// getObjectRequest.SetResponseStreamFactory(
//   [](){
//     return Aws::New(ALLOCATION_TAG, DOWNLOADED_FILENAME, std::ios_base::out | std::ios_base::in | std::ios_base::trunc);
//   });

// auto getObjectOutcome = s3Client.GetObject(getObjectRequest);
// if (getObjectOutcome.IsSuccess()){
//   std::cout << "File downloaded from S3 to location " << DONWLOADED_FILENAME;
// }
// else 
// {
//   std::cout << "File download failed from s3 with error " << getObjectOutcome.GetError().GetMessage();
// }

// Aws::ShutdownAPI(options);