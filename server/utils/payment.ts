import { NitroFetchRequest, TypedInternalResponse } from "nitropack";
import { FetchOptions } from "ofetch";
import { calculateChecksum } from "./helpers";
import { trimObject } from "../../utils/helpers";

interface PaymentUPIIntentResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: "UPI_INTENT";
      intentUrl: string;
    } | {
      type: "UPI_COLLECT";
      vpa: string;
    } | {
      qrData: any;
      type: "UPI_QR";
      qr: string;
    }
  };
}

export async function usePaymentAPI<T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions | undefined, callbackUrl: boolean = true): Promise<TypedInternalResponse<R, T>> {
  const config = useRuntimeConfig()

  const salt = config.private.paymentSecret as any
  opts.body.merchantId = config.private.paymentId
  // opts.body.merchantUserId = config.private.paymentUserId
  if (callbackUrl)
    opts.body.callbackUrl = `${config.public.apiUrl}/api/payment/webhook`
  console.log("usePaymentAPI ", { body: opts.body });

  const encodedPayload = Buffer.from(JSON.stringify(opts.body)).toString('base64')
  opts.body = { request: encodedPayload }

  const customFetch = $fetch.create({
    baseURL: config.private.paymentUrl,
    headers: {
      'X-Verify': calculateChecksum(encodedPayload, request as unknown as string, salt)
    },
    onRequest({ request, options }) {
      console.log("Intercepted Payment Request", request);
    },
    /* onResponse({ response }) {
      console.log("Intercepted Payment Response", response);
    }, */
    onResponseError({ response, error }) {
      console.error("Utils Payment", { response, error })
    },
  })

  // @ts-ignore
  return customFetch(request, opts)
}

enum Device {
  desktop = "DESKTOP",
  android = "ANDROID",
  ios = "IOS"
}

enum UPIType {
  intent = "UPI_INTENT",
  collect = "UPI_COLLECT",
  qr = "UPI_QR"
}

enum App {
  phonepe = "com.phonepe.app",
  gpay = "com.google.android.apps.nbu.paisa.user"
}

export async function createUPIPayment({ transactionId, amount, phone, type, device, app, vpa }:
  {
    transactionId: string,
    amount: number,
    phone: string,
    device?: "android" | "ios",
    type: "intent" | "collect" | "qr",
    app?: "phonepe" | "gpay",
    vpa?: string,
  }) {
  const payload = trimObject({
    merchantTransactionId: transactionId,
    amount: amount * 100,
    mobileNumber: phone,
    deviceContext: UPIType[type] === "UPI_INTENT" ? {
      // @ts-ignore
      deviceOS: Device[device]
    } : undefined,
    paymentInstrument: trimObject({
      type: UPIType[type],
      targetApp: !!app ? App[app] : undefined,
      vpa: !!vpa ? vpa : undefined
    })
  })
  // console.log({ payload });

  const response = await usePaymentAPI<PaymentUPIIntentResponse>("/pg/v1/pay", {
    method: "POST",
    body: payload,
  })
  // console.log({ response });
  // console.log({ instrumentResponse: response.data.instrumentResponse });

  return {
    success: response.success,
    code: response.code,
    type: response.data.instrumentResponse.type,
    intentUrl: response.data.instrumentResponse.type === "UPI_INTENT" || response.data.instrumentResponse.type === "UPI_QR" ? response.data.instrumentResponse.intentUrl : undefined,
    vpa: response.data.instrumentResponse.type === "UPI_COLLECT" ? vpa : undefined,
    qr: response.data.instrumentResponse.type === "UPI_QR" ? response.data.instrumentResponse.qrData : undefined,
  }
}