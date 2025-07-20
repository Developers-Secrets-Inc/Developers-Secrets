"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react" // Lucide icon

export const SkillTreeHelpDialog = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Help">
                    <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Skill Tree Help</DialogTitle>
                    <DialogDescription asChild>
                        <> {/* Use React.Fragment instead of div */}
                            <p>This skill tree visualizes your learning journey.</p>
                            <h3 className="font-semibold mt-4">Concepts:</h3>
                            <p>Nodes represent concepts. They can be:</p>
                            <ul className="list-disc list-inside ml-4">
                                <li>**Abstract Concepts:** General ideas (e.g., "Loops", "Data Structures").</li>
                                <li>**Concrete Concepts:** Specific applications or implementations (e.g., "For Loop in Python", "Linked List Implementation").</li>
                            </ul>
                            <h3 className="font-semibold mt-4">Progression:</h3>
                            <ul className="list-disc list-inside ml-4">
                                <li>Each concept shows your mastery percentage.</li>
                                <li>Concepts are locked until their prerequisites are mastered to a certain level.</li>
                                <li>Click on a concept node to see more details, including related challenges and your progress.</li>
                            </ul>
                            <h3 className="font-semibold mt-4">Navigation:</h3>
                            <p>Use the dropdown at the top to switch between different skill trees.</p>
                        </>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
