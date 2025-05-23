'use client'
import CreatePipelineForm from '@/components/forms/create-pipeline-form'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { deletePipeline } from '@/lib/queries'
import { Pipeline } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'

const PipelineSettings = ({
    pipelineId,
    subaccountId,
    pipelines,
} : {
    pipelineId: string
    subaccountId: string
    pipelines: Pipeline[]
}) => {
    const router = useRouter()
    return (
       <AlertDialog>
        <div>
            <div className="flex items-center justify-between mb-4">
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>Delete Pipeline</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are yout absolutely sure ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="items-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                           onClick={async () => {
                            try {
                                await deletePipeline(pipelineId)
                                toast({
                                    title: 'Deleted',
                                    description: 'Pipeline is deleted'
                                })
                                router.replace(`/subaccount/${subaccountId}/pipelines`)
                            } catch (error) {
                                toast({
                                    variant: 'destructive',
                                    title: 'Oppse!',
                                    description: 'Could Delete Pipeline',
                                })
                            }
                           }}
                          >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </div>

            <CreatePipelineForm 
               subAccountId={subaccountId}
               defaultData={pipelines.find((p) => p.id === pipelineId)}
            />
        </div>
       </AlertDialog>
    )
}



export default PipelineSettings