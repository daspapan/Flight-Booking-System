
import { Construct } from 'constructs';
import { CfnTemplate } from 'aws-cdk-lib/aws-ses';
import { bookingReceiptHtmlTemplate } from "./bookingTemplate";

type CreateSESProps = {
    appName: string
}

export function createSES(scope: Construct, props: CreateSESProps) {

    const bookingReceiptTemplate = new CfnTemplate(scope, `${props.appName}-BookingReceiptTemplate`, {
        template: {
            htmlPart: bookingReceiptHtmlTemplate,
            subjectPart: "Your flight was booked.",
            templateName: "BookingReceiptTemplate",
        }   
    })

    return bookingReceiptTemplate
    
}