import * as awsx from "@pulumi/awsx"
import * as pulumi from "@pulumi/pulumi"
import * as eks from "@pulumi/eks"

// Allocate a new VPC with the default settings:
const vpc = new awsx.ec2.Vpc("ephemeralVPC", {
    numberOfAvailabilityZones: 2,
    
    cidrBlock: "172.16.8.0/24",
    tags: {
        "Name": pulumi.getProject()
    }
})

const ephemeralEKS = new eks.Cluster("ephemeralEKS", {
    vpcId: vpc.id,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    nodeAssociatePublicIpAddress: false,
    tags: {
        "Name": pulumi.getProject()
    }
})


// Export a few resulting fields to make them easy to use:
export const ephemeralVPCID = vpc.id
export const privateSubnetIds = vpc.privateSubnetIds
export const publicSubnetIds = vpc.publicSubnetIds
export const kubeconfig = ephemeralEKS.kubeconfig