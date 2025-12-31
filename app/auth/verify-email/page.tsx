import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 p-4'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader className='space-y-1'>
          <div className='flex justify-center mb-4 text-primary'>
            <div className='rounded-full bg-primary/10 p-4'>
              <Mail className='h-10 w-10' />
            </div>
          </div>
          <CardTitle className='text-2xl'>Check your email</CardTitle>
          <CardDescription>
            We have sent a verification link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Please click the link in the email to verify your account and start
            using the library system.
          </p>
        </CardContent>
        <CardFooter className='flex items-center justify-center'>
          <Button>
            <Link href='/auth/login'>Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
