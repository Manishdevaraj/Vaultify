import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { getCurrentUser } from '@/lib/actions/user.action'
import { createSessionClient } from '@/lib/appwrite';

import { redirect } from 'next/navigation';

import React from 'react'

const Layout = async({children}:{children:React.ReactNode}) => {
  
  const {account}= await createSessionClient();

      account.get();

 


  const currentUser=await getCurrentUser();

  
  return currentUser&&(
     <main className="flex h-screen">
      <Sidebar {...currentUser} />

      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId}  />
        <div className="main-content">{children}</div>
      </section>

      <Toaster />
    </main>
  )
}

export default Layout