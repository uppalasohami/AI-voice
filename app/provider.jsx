"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'

function UserProvider({children}) {
    const [user,setUser]=useState();

    useEffect(()=>{
        let mounted = true;

        const ensureUserRecord = async (authUser) => {
            if (!authUser?.email) return;
            let { data: Users } = await supabase
                .from('Users')
                .select('*')
                .eq('email',authUser.email);
            if(!Users || Users.length === 0) {
                const { data } = await supabase.from('Users')
                    .insert([
                        {
                            name:authUser?.user_metadata?.name,
                            email:authUser.email,
                            picture:authUser?.user_metadata?.picture
                        }
                    ]).select().single();
                if (mounted) setUser(data || null);
                return;
            }
            if (mounted) setUser(Users[0]);
        }

        const init = async () => {
            const { data } = await supabase.auth.getUser();
            const authUser = data?.user;
            if (authUser?.email) {
                await ensureUserRecord(authUser);
            }
        }

        init();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            const authUser = session?.user;
            if (authUser?.email) {
                ensureUserRecord(authUser);
            } else {
                if (mounted) setUser(null);
            }
        });

        return () => {
            mounted = false;
            listener?.subscription?.unsubscribe?.();
        }

    },[])

  return (
    <UserDetailContext.Provider value={{ user , setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default UserProvider
export const useUser=()=>{
    const context=useContext(UserDetailContext);
    return context;
}