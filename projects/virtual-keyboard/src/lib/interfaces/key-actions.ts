export interface KeyActions {
    validate: ((args: string) => boolean) | undefined;
    //When We click on 'accept' keyboard button then We execute this method 
    accept: ((args: string) => boolean | void) | undefined;
  }
  