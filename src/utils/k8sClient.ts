import * as k8s from "@kubernetes/client-node";

import * as dotenv from "dotenv";
dotenv.config();
let environment = process.env.ENVIRONMENT as string;
console.log(`Connecting to k8s cluster in ${environment} mode`);

const kc = new k8s.KubeConfig();

if (environment === "dev") {
  let cluster = {
    name: process.env.CLUSTER_NAME,
    server: process.env.CLUSTER_SERVER,
    caData: process.env.CLUSTER_CADATA,
  };
  let user = {
    name: process.env.USER_NAME,
    token: process.env.USER_TOKEN,
  };
  let context = {
    name: process.env.CONTEXT_NAME,
    user: user.name,
    cluster: cluster.name,
  };
  kc.loadFromOptions({
    clusters: [cluster],
    users: [user],
    contexts: [context],
    currentContext: context.name,
  });
} else {
  kc.loadFromCluster();
}

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

export async function getK8sServicesByLabel(labelSelector: string) {
  const services = await coreV1Api.listNamespacedService(
    "default",
    undefined,
    false,
    undefined,
    undefined,
    labelSelector
  );
  let serviceList: string[] = [];
  for (const service of services.body.items) {
    let serviceName = service.metadata!.name as string;
    serviceList.push(serviceName);
  }
  return serviceList;
}