import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"

  const assets = [
    {
      avatarImageUrl: "/dscIcon/mixcat.png",
      linkUrl: "https://dexata.kr/#/?tokenA=0xdd483a970a7a7fef2b223c3510fac852799a88bf&tokenB=&interval=60",
      paymentStatus: "MIX",
      totalAmount: "250",
      paymentMethod: "Credit Card",
    },
    {
      avatarImageUrl: "/dscIcon/mate.png",
      linkUrl: "https://pro.x2y2.io/klaytn/collection/0xE47E90C58F8336A2f24Bcd9bCB530e2e02E1E8ae",
      paymentStatus: "MATE",
      totalAmount: "150",
      paymentMethod: "PayPal",
    },
    {
      avatarImageUrl: "/dscIcon/emate.png",
      linkUrl: "https://opensea.io/collection/dogesoundclub-emates",
      paymentStatus: "eMATE",
      totalAmount: "350",
      paymentMethod: "Bank Transfer",
    },
    {
      avatarImageUrl: "/dscIcon/bia.svg",
      linkUrl: "https://opensea.io/collection/bmcs",
      paymentStatus: "BIA",
      totalAmount: "450",
      paymentMethod: "Credit Card",
    },
  ]
  
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "@/components/shad/new-york/ui/avatar"
  
  export function WelcomeNewbies() {
    return (
      <Card className="p-6">
        <div className="font-scor uppercase p-4">
            <CardTitle>최근에 가입한 뉴비들</CardTitle>
        </div>
      <Table className="font-scor">
        <TableCaption className="text-xs">저출산 시대, 뉴비가 왕이다!</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="text-xs">닉네임</TableHead>
            <TableHead className="text-right text-xs">가입 시기</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.avatarImageUrl}>
              <TableCell className="font-medium">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={asset.avatarImageUrl} alt={asset.paymentStatus} />
                  <AvatarFallback>{asset.paymentStatus[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <a href={asset.linkUrl} target="_blank" rel="noopener noreferrer">
                  {asset.paymentStatus}
                </a>
              </TableCell>
              <TableCell className="text-right">{asset.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Card>
    )
  }