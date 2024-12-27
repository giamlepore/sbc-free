import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function ReferralProcessor() {
  const { data: session } = useSession();

  useEffect(() => {
    const processReferral = async () => {
      const referralCode = localStorage.getItem("referralCode");
      console.log("Processing referral:", {
        referralCode,
        userId: session?.user?.id,
      });

      if (
        session?.user?.id &&
        referralCode &&
        referralCode !== session.user.id
      ) {
        try {
          const response = await fetch("/api/process-referral", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session.user.id,
              referralCode,
            }),
          });

          const data = await response.json();
          console.log("Referral response:", data);

          if (response.ok) {
            localStorage.removeItem("referralCode");
          }
        } catch (error) {
          console.error("Error processing referral:", error);
        }
      }
    };

    console.log("ReferralProcessor - Session:", session);
    console.log(
      "ReferralProcessor - ReferralCode:",
      localStorage.getItem("referralCode"),
    );

    if (session?.user?.id) {
      setTimeout(() => {
        processReferral();
      }, 7000);
    }
  }, [session]);

  return null;
}
