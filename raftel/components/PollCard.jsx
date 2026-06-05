"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import vegapunkAvatar from "@/public/vegapunk.jpg";

export default function PollCard({ poll }) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState(poll.options);

  const handleVote = async (optionIndex) => {
    if (voted) return;

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll._id, optionIndex }),
      });

      if (res.ok) {
        // optimistic update — increment vote count locally
        const updated = options.map((opt, i) =>
          i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt,
        );
        setOptions(updated);
        setSelectedOption(optionIndex);
        setVoted(true);
      } else {
        console.error("Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // calculate percentages — do this before return
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4">
      {/* poll header */}
      <div className="flex items-center gap-3">
        {poll.isAiGenerated ? (
          <div className="flex items-center gap-2">
            <Image
              src={vegapunkAvatar}
              alt="Vegapunk"
              className="w-9 h-9 rounded-full object-cover"
              width={36}
              height={36}
            />
            <span className="text-sm text-zinc-400">Vegapunk</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={poll.createdBy?.avatar}
              alt={poll.createdBy?.username}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-sm text-zinc-400">
              {poll.createdBy?.username}
            </span>
          </div>
        )}
        
        <span className="text-sm text-zinc-400">
          {poll.isAiGenerated ? "AI Generated" : poll.createdBy?.username}
        </span>
      </div>

      {/* question */}
      <h2 className="text-white font-semibold text-lg">{poll.question}</h2>

      {/* options */}
      <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const percentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isSelected = selectedOption === index;

          return voted ? (
            // show percentage bars after voting
            <div
              key={index}
              className="relative w-full rounded-xl overflow-hidden border border-zinc-800 h-10"
            >
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${isSelected ? "bg-orange-500/30" : "bg-zinc-800"}`}
                style={{ width: `${percentage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-sm text-white">{option.text}</span>
                <span
                  className={`text-sm font-bold ${isSelected ? "text-orange-400" : "text-zinc-400"}`}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            // show plain buttons before voting
            <button
              key={index}
              onClick={() => handleVote(index)}
              className="w-full text-left px-4 py-2 rounded-xl border border-zinc-800 text-sm text-zinc-300 hover:border-orange-500 hover:text-white transition"
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {/* footer */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-zinc-800">
        <span>{totalVotes} votes</span>
        <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { useState } from "react"
// import vegapunkAvatar from "@/public/vegapunkAvatar.jpg"
// import { user } from "modals/User"
// import { Button } from "@/components/ui/button"

// export default function PollCard({ poll }){

//     const [ voted, setVoted ] = useState(false)
//     const [ selectedOption, setSelectedOption ] = useState(null)

//     const handleVote = async (optionIndex) =>{

//         if( voted ) return
//         //  call POST /api/votes with pollId and optionIndex
//         try{

//             const res = await fetch("/api/votes", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.strinfify({ pollId:poll._id, optionIndex})
//             })
//             if(res.ok){
//                 setSelectedOption(optionIndex)
//                 setVoted(true)
//             } else {
//                 console.error("Failed to vote")
//             }

//         } catch (error){
//             console.error("Error voting:", error)
//         }
//     }

// return (

//     <div>
//     {poll.isAiGenerated ?
//         <div>
//         <Image src={vegapunkAvatar} alt="Vegapunk AI" />
//         </div> :
//         <div>
//         <Image src={poll.creator.avatar} alt={poll.creator.username} width={40} height={40} />
//         </div>
//     }
//     //beside the above avatar
//     <div>
//         <h3>{user.username}</h3>
//     </div>

//     <div>
//           {/* options — map over poll.options */}
//         <h2>{poll.question}</h2>
//         {poll.options.map((option, index) => (
//             <button key={index} onClick={() => handleVote(index)} disabled={voted}>
//                 {option.text} - {option.votes} votes
//             </button>
//         ))}
//     </div>

//         {/* if voted → show percentage bar */}

//         { voted ? <div>
//             const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
//             poll.options.map((option, index) => {
//                 const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
//                 return (
//                     <div key={index}>
//                         <span>{option.text}</span>
//                         <div style={{ width: "100%", backgroundColor: "#ccc" }}>
//                             <div style={{ width: `${percentage}%`, backgroundColor: "#f00", height: "10px" }} />
//                         </div>
//                         <span>{percentage.toFixed(1)}%</span>
//                     </div>
//                 )
//             })
//         }

//             </div> :
//             {/*   if not voted → show plain option button */}

//             <div>
//                 {poll.options.map((option, index) => (
//                     <button key={index} onClick={() => handleVote(index)} disabled={voted}>
//                         {option.text}
//                     </button>
//                 ))}

//             </div>

//         }

//       {/* poll footer — total votes, comment count, time ago */}
//         <div>
//         <span>{poll.totalVotes} votes</span>
//         <span>{poll.comments.length} comments</span>
//         <span>{formatTimeAgo(poll.createdAt)}</span>
//         </div>

//       {/* like button */}
//      <div>
//         <Button onClick={() => console.log("Liked!")} disabled={voted} >
//             Like
//         </Button>
//       </div>

//     </div>

// }
