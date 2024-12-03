'use client';
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useForm } from 'react-hook-form'
import Image from 'next/image';
import Link from 'next/link';
import { createAccount, signInUser } from '@/lib/actions/user.action';
import OTPModal from './OTPModal';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';



 


type FormType="sign-in"|"sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};


function AuthForm({type}:{type:FormType}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const router=useRouter();
  
  const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fullName: "",
          email:""
        },
      })

     async function onSubmit(values: z.infer<typeof formSchema>) {
       
        setIsLoading(true);
        setErrorMessage('');

        try {
          const user= 
          type==='sign-up'?await createAccount(
            {
              fullName:values.fullName ||"" ,
              email:values.email
            }
          ) : await signInUser({email:values.email});

          if(!user.accountId) {
            console.log('helo');
            toast({
              description: (
                <p className="body-2 text-white">
                  <span className="font-semibold">User is not found
                  </span>
                </p>
              ),
              className: "error-toast",
            });
            router.push('/sign-up');
          }
  
          setAccountId(user.accountId);
          
        } catch (error) {
          setErrorMessage('Failed to create an account.Please try again.'+error)
          
        }
        finally{
          setIsLoading(false);
        }
        
      }
    

    return (
    <>
    
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
            <h1 className='form-title'>{type==="sign-in"?"Sign In":"Sign Up"}</h1>
            {type==="sign-up"&&
            <FormField
              control={form.control}
              name="fullName" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='shad-form-label'>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter null name" className='shad-input'  {...field} />
                  </FormControl>
                  
                  <FormMessage className='shad-form-message' />
                </FormItem>
              )}
            />}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='shad-form-label'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" className='shad-input'  {...field} />
                  </FormControl>
                  
                  <FormMessage className='shad-form-message' />
                </FormItem>
              )}
            />
            <Button type="submit" className='form-submit-button' disabled={isLoading}>{type==="sign-in"?"Sign In":"Sign Up"}

            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}

            </Button>

            {errorMessage && <p className="error-message">*{errorMessage}</p>}

            <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {" "}
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
          </form>
        </Form>

       {accountId&&<OTPModal email={form.getValues('email')} accountId={accountId}/>}
    </>    
      )
    }
export default AuthForm