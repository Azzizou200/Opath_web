import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

// Create a single supabase client for the entire app
const supabaseUrl = "https://ykkipspaahuvemajqobx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlra2lwc3BhYWh1dmVtYWpxb2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MTg0OTAsImV4cCI6MjA1NDI5NDQ5MH0.noxTUdZMwIdMTOb6_6H-BRzK_-mTw99dtDGBjf2-ZAs";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export const auth = {
  /**
   * Sign in with email and password
   */
  signInWithPassword: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    return await supabase.auth.getUser();
  },

  /**
   * Set up an auth state change listener
   */
  onAuthStateChange: (callback: (user: User | null) => void) => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user || null);
    });
    return data.subscription;
  }
};

// Database functions
export const db = {
  /**
   * Get instruments (buses)
   */
  getInstruments: async () => {
    return await supabase.from("buses").select("id");
  },

  /**
   * Generic function to select data from any table
   */
  select: async <T>(
    table: string, 
    columns: string = "*", 
    query?: { [key: string]: any }
  ) => {
    let queryBuilder = supabase.from(table).select(columns);
    
    // Apply any filters from the query object
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }
    
    return await queryBuilder as { data: T[] | null; error: any };
  },
  
  /**
   * Insert data into a table
   */
  insert: async <T>(
    table: string,
    data: { [key: string]: any } | { [key: string]: any }[]
  ) => {
    return await supabase.from(table).insert(data).select() as { data: T[] | null; error: any };
  },
  
  /**
   * Update data in a table
   */
  update: async <T>(
    table: string,
    data: { [key: string]: any },
    query: { [key: string]: any }
  ) => {
    let queryBuilder = supabase.from(table).update(data);
    
    // Apply any filters from the query object
    Object.entries(query).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
    
    return await queryBuilder.select() as { data: T[] | null; error: any };
  },
  
  /**
   * Delete data from a table
   */
  delete: async <T>(
    table: string,
    query: { [key: string]: any }
  ) => {
    let queryBuilder = supabase.from(table).delete();
    
    // Apply any filters from the query object
    Object.entries(query).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
    
    return await queryBuilder.select() as { data: T[] | null; error: any };
  }
};

// Storage functions
export const storage = {
  /**
   * Upload a file to storage
   */
  upload: async (bucket: string, path: string, file: File) => {
    return await supabase.storage.from(bucket).upload(path, file);
  },
  
  /**
   * Get a public URL for a file
   */
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },
  
  /**
   * Delete a file from storage
   */
  delete: async (bucket: string, paths: string[]) => {
    return await supabase.storage.from(bucket).remove(paths);
  }
};

// Export the typed client for advanced use cases
export type { SupabaseClient }; 