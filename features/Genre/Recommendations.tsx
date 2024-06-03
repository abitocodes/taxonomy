import { FC, useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

import useGenreData from "@/hooks/useGenreData";
import { Genre } from "@/types/genresState";
import { Card, CardHeader, CardContent } from "@/components/shad/new-york/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";

type RecommendationsProps = {};

const Recommendations: FC<RecommendationsProps> = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const { genreStateValue, onJoinLeaveGenre } = useGenreData(); 

  function getGenreRecommendations() 
  { return fetch('/api/getGenreRecommendations'); }

  useEffect(() => {
    try {
      getGenreRecommendations().then(res => res.json()).then(data => { 
        const typedData = data.genres.map((genre: Genre) => ({
          ...genre,
          privacyType: genre.privacyType as "public" | "restricted" | "private",
          imageURL: genre.imageURL ?? undefined
        }));
        setGenres(typedData);
        setLoading(false);
      });
    }
    catch (error) {
      console.error("Error fetching genres", error);
    }
  }, []);

  return (
    <Card>
      <CardHeader 
        className="flex"
      >
        <span className="font-bold">상위 채널</span>
      </CardHeader>
      <CardContent className="flex item-center w-full">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableBody>
              {genres.map((genre, index) => {
                const isJoined = !!genreStateValue.mySnippets.find((snippet) => snippet.genreId === genre.id);
                return (
                    <TableRow key={genre.id} className="flex items-center">
                      <TableCell className="flex justify-center">
                        <span>{index + 1}</span>
                      </TableCell>
                      <TableCell className="flex justify-center"> 
                        <Link href={`/g/${genre.id}`}>       
                          {genre.imageURL ? (
                            <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src={genre.imageURL} alt="genre image" />
                            <AvatarFallback>404</AvatarFallback>
                            </Avatar>
                          ) : (
                            <FaReddit className="text-[#FF4500] text-7.5 mr-2" />
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="w-full">
                        <Link href={`/g/${genre.id}`}>  
                          <span>{`r/${genre.id}`}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          className={`h-5.5 text-xs ${isJoined ? "border border-blue-500" : "bg-blue-500 text-white"} rounded-md`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onJoinLeaveGenre(genre, isJoined);
                          }}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </TableCell>

                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default Recommendations;