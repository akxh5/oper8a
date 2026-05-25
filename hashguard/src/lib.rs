use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::PublicKey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct FileMetadata {
    pub hash: String,
    pub name: String,
    pub size: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserFiles {
    pub owner: PublicKey,
    pub files: Vec<FileMetadata>,
}

pub enum Instruction {
    AddFile(FileMetadata),
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match tag {
            0 => Self::AddFile(FileMetadata::try_from_slice(rest)?),
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &PublicKey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = Instruction::unpack(instruction_data)?;

    match instruction {
        Instruction::AddFile(metadata) => {
            msg!("Instruction: AddFile");
            msg!("File: {}, Hash: {}, Size: {}", metadata.name, metadata.hash, metadata.size);
            
            let accounts_iter = &mut accounts.iter();
            let _network_pda = next_account_info(accounts_iter)?;
            let user = next_account_info(accounts_iter)?;
            let _system_program = next_account_info(accounts_iter)?;

            if !user.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }

            // Note: The actual on-chain proof is currently also logged via the Memo program
            // to ensure human-readability on Solana Explorer.
            
            Ok(())
        }
    }
}
