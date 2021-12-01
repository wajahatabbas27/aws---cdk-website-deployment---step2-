import * as cdk from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class Step02HelloWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //the code consists of 4 steps to deploy a website on aws 
    //1- build s3 bucket for code
    //2- build the cloudfront distribution to deploy the website 
    //3- make the endpoint of website using the distribution
    //4- deploy the site using s3deploy


    // create a bucket to upload your app files

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      versioned: true,
    });

    // create a CDN to deploy your website - cloudfront

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
      },
      defaultRootObject: "index.html",
    });

    // Prints out the web endpoint to the terminal using the distribution of cloudfront

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
    });

    // housekeeping for uploading the data in bucket - deplying using the s3deploy

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./website")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

  }
}
