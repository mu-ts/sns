import { SNSClient } from "@aws-sdk/client-sns";

export class SNSClientWrapper {

  private static _instance: SNSClientWrapper;

  private snsClient: SNSClient;

  constructor(){
    this.snsClient = new SNSClient({region: (process.env.REGION as string || process.env.AWS_REGION as string || 'us-east-1')});
  }

  get client(): SNSClient {
    return this.snsClient;
  }

  set region(region: string) {
    this.snsClient = new SNSClient({region});
  }
  
  public static instance() {
    if(!SNSClientWrapper._instance) SNSClientWrapper._instance = new SNSClientWrapper();
    return SNSClientWrapper._instance;
  }
}