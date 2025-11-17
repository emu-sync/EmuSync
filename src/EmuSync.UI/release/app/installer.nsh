!define AGENT_TARGET "$PROGRAMFILES\\EmuSync-agent"

!macro customInstall
  DetailPrint "Installing/updating EmuSync Agent..."

  ; Stop and remove existing service if it exists
  nsExec::ExecToLog 'sc query "EmuSyncAgent" >nul 2>&1'
  Pop $0
  StrCmp $0 0 +3
    nsExec::ExecToLog 'sc stop "EmuSyncAgent"'
    Sleep 5000
    nsExec::ExecToLog 'sc delete "EmuSyncAgent"'
    Sleep 1000

  ; Create target folder for the service
  CreateDirectory "${AGENT_TARGET}"

  ; Copy files from staging folder in resources
  nsExec::ExecToLog 'xcopy /y /e /i "$INSTDIR\\resources\\agent" "${AGENT_TARGET}"'

  ; Delete staging folder in resources
  RMDir /r "$INSTDIR\\resources\\agent"

  ; Install and start the service
  nsExec::ExecToLog 'sc create "EmuSyncAgent" binPath= "${AGENT_TARGET}\\EmuSync.Agent.exe" start= auto DisplayName= "EmuSync Agent"'
  nsExec::ExecToLog 'sc start "EmuSyncAgent"'
!macroend

!macro customUninstall
  DetailPrint "Stopping and removing EmuSync Agent..."

  ; Stop and delete service if it exists
  nsExec::ExecToLog 'sc query "EmuSyncAgent" >nul 2>&1'
  Pop $0
  StrCmp $0 0 +3
    nsExec::ExecToLog 'sc stop "EmuSyncAgent"'
    Sleep 5000
    nsExec::ExecToLog 'sc delete "EmuSyncAgent"'
    Sleep 1000

  ; Delete service folder
  RMDir /r "${AGENT_TARGET}"
!macroend
