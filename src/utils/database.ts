import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Classe utilitaire pour gérer la connexion Supabase
 * Crée une instance unique du client Supabase réutilisable dans toute l'application
 */
export default class DatabaseUtil {
  private static _supabase: SupabaseClient | null = null;

  /**
   * Obtient l'instance du client Supabase
   * Crée la connexion si elle n'existe pas encore
   * @returns {SupabaseClient} Instance du client Supabase
   */
  static get supabase(): SupabaseClient {
    if (!this._supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          'Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY doivent être définies'
        );
      }

      this._supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    return this._supabase;
  }

  /**
   * Réinitialise la connexion Supabase
   * Utile pour les tests ou en cas de reconnexion nécessaire
   */
  static reset(): void {
    this._supabase = null;
  }
}
