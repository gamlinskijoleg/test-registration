import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const useProtectedRoute = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) {
				navigate("/");
			}
		};

		checkAuth();
	}, [navigate]);
};

export default useProtectedRoute;
